ig.module( 'game.entities.lavaSerpent' )
    .requires( 
    'impact.entity',
    'game.entities.lavaSpit'
)
    .defines ( function()
              {
    EntityLavaSerpent = ig.Entity.extend(
        {
            animSheet: new ig.AnimationSheet( 'media/lavaSerpent.png', 640, 640 ),
            size: {x: 628, y:112},
            offset: {x:10, y:220},
            flip: true,
            maxVel: {x:200, y:300},
            //    zIndex: 1,
            health: 10,

            type: ig.Entity.TYPE.B,
            checkAgainst: ig.Entity.TYPE.A,
            collides: ig.Entity.COLLIDES.FIXED,

            playerIsInSight: false,

            startPos: null,
            destination: null,

            sightSize: { x: 1280, y: 960 },
            sightBox: null,

            flyTimer: null,
            sipTimer: null,
            spitTimer: null,
            reachedLava: false,
            timeToReachLava: 0,
            damageTimer: null,

            isMeleeAttack: false,

            gettingUnstuck: false,

            //    vine1: null, //to see hitbox
            //     vine2: null,


            init: function(x, y, settings)
            {
                this.parent( x,y, settings );
                this.addAnim( 'idle', 0.2, [0,1,2,3,4] );
                this.addAnim( 'attack', 0.2, [5,6,7,8,9] );
                this.currentAnim = this.anims.idle;
                this.gravityFactor = 0;

                this.startPos = { x: x, y: y}
                //      this.vine1 = ig.game.spawnEntity(EntityVine, this.pos.x, this.pos.y)
                //     this.vine2 = ig.game.spawnEntity(EntityVine, this.pos.x + this.size.x, this.pos.y + this.size.y)

            },
            update: function()
            {
                if (!this.sightBox) //if it hasnt been created yet (can't put this in init because weltmeister cant execute this when placing entity)
                    this.sightBox = ig.game.spawnEntity(EntitySightBox, this.pos.x, this.pos.y, { owner: this, size: this.sightSize });                

                //     this.vine1.pos = {x: this.pos.x, y: this.pos.y};
                //     this.vine2.pos = {x: this.pos.x + this.size.x, y: this.pos.y + this.size.y}

                if (this.flyTimer) {
                    if (this.reachedLava) {
                        this.vel.y = 0; //stop lowering
                        if (!this.sipTimer) {
                            this.sipTimer = new ig.Timer();
                        } else if (this.sipTimer.delta() > 3) {
                            this.sipTimer = null;
                            this.flyTimer = null;
                            this.reachedLava = false;
                            this.anims.idle.angle = 0; //go back to normal orientation
                            this.size = {x: 628, y:112};
                            this.offset = {x:10, y:220};
                            this.spitLava();
                        }

                    } else {
                        this.vel.y = 75;
                    }
                } else if (this.spitTimer) {
                    if (this.spitTimer.delta() < 1.5) {
                        this.vel.y = -75;
                    } else if (this.spitTimer.delta() < 20) {
                        if (this.spitTimer.delta() < 7) { //1.5 to 7 sec
                            this.vel.y = 0;
                            if (Math.random() < 0.03)
                                ig.game.spawnEntity(EntityLavaSpit, this.pos.x + this.size.x/2, this.pos.y, { yVel: -400, owner: this })
                        } else if ( this.spitTimer.delta() < 10) { //7 to 10 sec
                            if (Math.random() < 0.12)
                                ig.game.spawnEntity(EntityLavaSpit, this.pos.x + (Math.random() * 2000) - 1000, -128, { yVel: 200, owner: this })
                        } else { //10 to 20 sec
                            if (Math.random() < 0.12)
                                ig.game.spawnEntity(EntityLavaSpit, this.pos.x + (Math.random() * 2000) - 1000, -128, { yVel: 200, owner: this })

                            this.anims.attack.angle = 0; //go back to normal orientation
                            this.currentAnim = this.anims.idle;
                            this.size = {x: 628, y:112};
                            this.offset = {x:10, y:220};

                            this.destination = this.startPos; //go back to origin

                        }//if-elseif-else
                    } else { //stop entire sequence
                        this.spitTimer = null;
                    }//if-elseif-else
                } else {
                    if (this.playerIsInSight && !this.destination) {
                        let r = Math.random();
                        if (r < 0.3)
                            this.drinkLava();
                        else {
                            this.isMeleeAttack = true;
                            this.currentAnim = this.anims.attack;
                        }
                    }//if

                    if (this.destination) { //fly at max speed toward destination
                        let xVel = this.destination.x - this.pos.x;
                        let yVel = this.destination.y - this.pos.y;

                        let ratioToMax;

                        if (Math.abs(xVel) > Math.abs(yVel)) {
                            ratioToMax = this.maxVel.x / Math.abs(xVel)
                            this.vel.x = xVel * ratioToMax;
                            if (!this.gettingUnstuck)
                                this.vel.y = yVel * ratioToMax;
                        } else {
                            ratioToMax = this.maxVel.y / Math.abs(yVel)
                            this.vel.x = xVel * ratioToMax;
                            if (!this.gettingUnstuck)
                                this.vel.y = yVel * ratioToMax;
                        }

                        if (this.destination.x - this.pos.x < 10 && this.destination.y - this.pos.y < 10) {
                            this.vel = { x: 0, y: 0};
                            this.destination = null;
                        }
                    }//if
                }//if-elseif-else

                if (this.isMeleeAttack) {
                    this.destination = ig.game.player.pos;
                }



                // check to see if the flip needs to change (true/false)
                this.currentAnim.flip.x = this.flip;

                this.last.x = this.pos.x;
                this.last.y = this.pos.y;
                this.vel.y += ig.game.gravity * ig.system.tick * this.gravityFactor;

                this.vel.x = this.getNewVelocity( this.vel.x, this.accel.x, this.friction.x, this.maxVel.x );
                this.vel.y = this.getNewVelocity( this.vel.y, this.accel.y, this.friction.y, this.maxVel.y );

                // movement & collision
                var mx = this.vel.x * ig.system.tick;
                var my = this.vel.y * ig.system.tick;
                var res = ig.game.collisionMap.trace( 
                    this.pos.x, this.pos.y, mx, my, this.size.x, this.size.y
                );

                if (res.collision.x) {
                    if (this.destination) {
                        if (this.destination.y > this.pos.y + this.size.y)
                            this.vel.y = this.maxVel.y;
                        else 
                            this.vel.y = -this.maxVel.y;
                    }
                    this.gettingUnstuck = true;
                } else {
                    this.gettingUnstuck = false;
                }

                this.handleMovementTrace( res );

                if( this.currentAnim ) {
                    this.currentAnim.update();
                }
            },

            flyAt: function(x, y) { //melee flies at enemy

            },

            drinkLava: function() { //drinks from lava for a few seconds, then spits it upward (out of screen) and it falls down randomly over time
                this.currentAnim = this.anims.idle;
                this.anims.idle.angle = -Math.PI / 5;
                this.flyTimer = new ig.Timer();
                //   this.size = { x: 336, y: 434};
                this.size = { x: 475, y: 330};
                this.offset = { x: 82, y: 118};

            },

            spitLava: function() {
                this.currentAnim = this.anims.attack;
                this.anims.attack.angle = Math.PI / 2;
                this.size = {x: 100, y:628};
                this.offset = {x:300, y:10};
                this.spitTimer = new ig.Timer();

            },

            flingLava: function() { //slaps tail into lava and flings it at the enemy

            },

            breatheFire: function() { //shoot out flames at enemy

            },


            receiveDamage: function(amount, from) {
                if (!this.damageTimer || this.damageTimer.delta() > 1)  { //if damagetimer has not been initiated or it's been 1 second
                    this.damageTimer = new ig.Timer();

                    if (!this.flyTimer && !this.spitTimer) { //only return home if not spitting
                        this.isMeleeAttack = false;
                        this.destination = this.startPos; //return home if it takes damage
                        this.currentAnim = this.anims.idle;
                    }

                    this.parent(amount, from);
                }//if
            },

            check: function(other) {
                if (other instanceof EntityPlayer) {
                    if (this.destination) {
                        other.receiveDamage(2);
                        this.isMeleeAttack = false;
                        this.currentAnim = this.anims.idle;
                        this.destination = this.startPos; //return home if it takes damage
                    }
                }//
            },

            kill: function() {
                for ( let i = 0; i < 10; i++ )
                    ig.game.spawnEntity(EntitySparkExplosion, ig.game.player.pos.x + (Math.random() * 2 - 1) * 300, ig.game.player.pos.y + (Math.random() * 150 - 118))
                this.parent();

            }

        });

});