ig.module( 
    'game.entities.player'
)
    .requires(
    'impact.entity',
    'game.entities.energyOrb',
    'game.entities.hitbox',
    'game.entities.heart'
)
    .defines ( function()
              {
    EntityPlayer = ig.Entity.extend(
        {
            animSheet: new ig.AnimationSheet( 'media/Player.png', 64, 64 ),
            size: {x: 41, y:63},
            offset: {x:11, y:1},
            flip: false,
            maxVel: {x:200, y:400},
            friction: {x:600, y:0},
            type: ig.Entity.TYPE.A,
            health: 5,
            hearts: [],


            gravityPercent: 1,
            accelGround: 500,
            accelAir: 400,
            jump: 350,
            damageTimer: null,
            hasControl: true,
            isKicking: false,
            isDropKicking: false,
            inWater: false,
            isFlying: false,
            isSwinging: false,
            collides: ig.Entity.COLLIDES.PASSIVE,

            dropKickCooldown: null,

            //    dropkick/fly    energy orb
            boots: [false,          false],


            init: function(x, y, settings)
            {
                this.parent( x,y, settings );
                this.addAnim( 'idle', 1, [0] );
                this.addAnim( 'run', 0.07, [0,1,2,3,4,5,6,7,8,9] );
                this.addAnim( 'jump', 1, [20] );
                this.addAnim( 'fall', 1, [21] );	

                this.addAnim( 'kick', 0.03, [10,11,12,13,14,15,16,17,18,19] );
                this.currentAnim = this.anims.idle;

                ig.game.player = this;

                if (!ig.global.wm) {//don't do this if in weltmeister
                    for (let i = 0; i < this.health; i++)
                        this.hearts[i] = ig.game.spawnEntity(EntityHeart, x, y, {index: i});
                }
            },

            update: function()
            {
                var accel = this.standing ? this.accelGround : this.accelAir;
                
                if (this.pos.y > ig.game.collisionMap.pxHeight)
                    this.kill();

                if (this.standing) {
                    switch (ig.game.currentLevel) {
                        case LevelLevel1:
                            this.friction = { x: 600, y: 0 };break;
                        case LevelIceLevel:
                            this.friction = { x: 150, y: 0};break;
                        case LevelLavaLevel: 
                            this.friction = { x: 900, y: 0};break;
                    }//switch
                } else if (this.inWater) {
                    this.friction = {x:200, y:200};
                } else if (this.isFlying) {
                    this.friction = { x: 200, y: 200 }
                } else if (this.isDropKicking) {
                    this.friction = {x:0, y:0};
                } else {
                    this.friction = {x: 200, y:0};
                }

                this.isKicking = (this.currentAnim === this.anims.kick && this.currentAnim.frame < 9 );

                if(ig.input.state('musicPlay')) {
                    console.log("playing");
                    ig.music.play();
                }
                   
                if (this.hasControl) {
                    if(ig.input.state('left')) {
                        this.accel.x = -accel;
                        if (!this.isKicking) {//don't flip if kicking and have not already flipped
                            this.currentAnim = this.anims.run;
                            //        if (this.inWater)
                            //    this.anims.run.angle = Math.PI * 2;
                            this.flip = true;
                        }
                    } else if(ig.input.state('right')) {
                        this.accel.x = accel;
                        if (!this.isKicking) {//don't flip if kicking and have not already flipped
                            this.currentAnim = this.anims.run;
                            //        if (this.inWater)
                            //      this.anims.run.angle = 3 * Math.PI * 2;
                            this.flip = false;
                        }
                    } else {
                        this.accel.x = 0;
                        if (!this.isKicking)
                            this.currentAnim = this.anims.idle;

                    }//if-elseif-else

                    if (this.inWater || this.isFlying) {
                        if(ig.input.state('jump')) {
                            this.accel.y = -accel;
                        } else if(ig.input.state('down')) {
                            this.accel.y = accel;
                        } else {
                            this.accel.y = 0;
                        }//if-elseif-else
                    }//if
                }//if

                if (ig.input.state('meleeKick')) {
                    this.meleeKick();
                } else if (ig.input.state('dropKick')) {
                    if (!this.dropKickCooldown || this.dropKickCooldown.delta() > 2) //1 second has passed since last drop kick
                        if (!this.isDropKicking && Math.abs(this.vel.x) >= this.maxVel.x) //not currently dropkicking and running full speed
                            this.dropKick();
                } else if (ig.input.state('energyOrb')) {
                    if (ig.game.getEntitiesByType(EntityEnergyOrb).length === 0) //only allow one at a time
                        this.summonEnergyOrb();
                }//if-elseif


                // jump
                if( this.standing && ig.input.pressed('jump') )
                    this.vel.y = -this.jump;

                if (this.currentAnim !== this.anims.kick && !this.isDropKicking && !this.inWater && !this.isFlying) {
                    if( this.vel.y < 0 ) 
                        this.currentAnim = this.anims.jump;
                    else if( this.vel.y > 0 ) 
                        this.currentAnim = this.anims.fall;
                }//if
                
                if (this.isSwinging)
                    this.currentAnim = this.anims.jump;

                // check to see if the flip needs to change (true/false)
                this.currentAnim.flip.x = this.flip;

                for (let i = 0; i < ig.game.parallaxes.length; i++) {
                    ig.game.parallaxes[i].specialUpdate();
                }//for

                // finally activate the move WITH PERCENT GRAVITY
                this.last.x = this.pos.x;
                this.last.y = this.pos.y;
                this.vel.y += (ig.game.gravity*this.gravityPercent) * ig.system.tick * this.gravityFactor; //added the *gravitypercent

                this.vel.x = this.getNewVelocity( this.vel.x, this.accel.x, this.friction.x, this.maxVel.x );
                this.vel.y = this.getNewVelocity( this.vel.y, this.accel.y, this.friction.y, this.maxVel.y );

                // movement & collision
                var mx = this.vel.x * ig.system.tick;
                var my = this.vel.y * ig.system.tick;
                var res = ig.game.collisionMap.trace( 
                    this.pos.x, this.pos.y, mx, my, this.size.x, this.size.y
                );
                this.handleMovementTrace( res );

                if (this.isDropKicking) {
                    if (res.collision.y || this.dropKickCooldown.delta() > 2) { //stop dropkicking if you hit the ground or if 2 seconds have passed
                        //rotate hitbox
                        this.size = { x: 41, y: 63};
                        this.offset = { x: 11, y: 1};

                        this.pos.y -= (63 - 41); //make up for change hitbox


                        this.isDropKicking = false;
                        this.hasControl = true;
                        this.checkAgainst = ig.Entity.TYPE.NONE;
                        this.check = function( other ) {}

                        this.anims.idle.angle = 0;
                    }
                }

                if(this.currentAnim)
                    this.currentAnim.update();


                //resetting whatever is changed by check entities (i.e water)
                //if it actually SHOULD be changed, it will be changed back in check() functions
                this.maxVel = { x: 200, y: 400 }
                this.accel = { x: 0, y: 0 }
                this.gravityPercent = 1;
                this.inWater = false;
                this.isFlying = false;
                //      this.anims.run.angle = 0;
            },

            receiveDamage: function(amount, from) {
                if (!this.damageTimer || this.damageTimer.delta() > 1)  { //if damagetimer has not been initiated or it's been 1 second
                    this.damageTimer = new ig.Timer();
                    this.parent(amount, from);

                    for (let i = 0; i < this.hearts.length; i++) { //updating hearts UI
                        if (i < this.health)
                            this.hearts[i].currentAnim = this.hearts[i].anims.full;
                        else
                            this.hearts[i].currentAnim = this.hearts[i].anims.empty;
                    }
                }//if
            },

            kill: function() {
                this.parent();
                ig.game.loadLevel(ig.game.currentLevel);
            },

            meleeKick: function() {
                //animate kick
                this.currentAnim = this.anims.kick;
                this.currentAnim.gotoFrame(0)

                let kickSettings = { 
                    amount: 1,
                    checkAgainst: ig.Entity.TYPE.B,
                    size: { x: 128, y: 64 },
                    isKick: true,
                    startTime: 0.2,
                    endTime: 0.4,
                };

                if (this.flip) {
                    ig.game.spawnEntity(EntityHitbox, this.pos.x - this.size.x, this.pos.y, kickSettings);
                } else {
                    ig.game.spawnEntity(EntityHitbox, this.pos.x, this.pos.y, kickSettings);
                }//if-else
            },

            dropKick: function() {
                //rotate hitbox
                this.size = { x: 63, y: 41};
                this.offset = { x: 1, y: 11};

                this.isDropKicking = true;
                this.hasControl = false;
                this.checkAgainst = ig.Entity.TYPE.B;

                this.check = function( other ) {
                    if (other instanceof EntityEnergyOrb && other.currentAnim !== other.anims.spawning) {

                        if (ig.game.player.flip)
                            other.vel.x = -400;
                        else
                            other.vel.x = 400;
                    } else {
                        other.receiveDamage(2);
                    }
                }//check(other)

                if (this.standing)
                    this.vel.y -= 150;

                this.currentAnim = this.anims.idle;

                if (this.vel.x > 0)
                    this.currentAnim.angle = 3 * Math.PI / 2;
                else
                    this.currentAnim.angle = Math.PI / 2;

                this.dropKickCooldown = new ig.Timer();
            },


            summonEnergyOrb: function() {
           //     if (this.standing) {
                    this.currentAnim = this.anims.idle;

                    //rotate hitbox
                    this.size = { x: 63, y: 41};
                    this.offset = { x: 1, y: 11};

                    if (this.flip)
                        this.currentAnim.angle = Math.PI / 2;
                    else
                        this.currentAnim.angle = 3 * Math.PI / 2;

                    this.vel = { x: 0, y: 0 }
                    this.accel = { x: 0, y: 0 }

                    this.gravityPercent = 0;
                    this.hasControl = false;

                    ig.game.spawnEntity(EntityEnergyOrb, this.flip ? this.pos.x - 64 - 16 : this.pos.x + 64 + 16, this.pos.y);

       //         }//if
            }

        });

});