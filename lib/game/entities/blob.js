ig.module(
    'game.entities.blob'
).requires(
    'impact.entity',
    'game.entities.sightBox',
    'game.entities.sparkExplosion'
).defines ( function()
           {
    EntityBlob = ig.Entity.extend(
        {
            animSheet: new ig.AnimationSheet( 'media/blob.png', 32, 32 ),
            size: {x: 28, y:32},
            offset: {x:2, y:0},
            flip: false,
            maxVel: {x:175, y:300},
            friction: {x:600, y:0},
            type: ig.Entity.TYPE.B,
            checkAgainst: ig.Entity.TYPE.A,

            playerIsInSight: false,

            sightBox: null,

            origin: null,

            domain: 200,
            
            sightSize: { x: 192, y: 80 },


            init: function(x, y, settings)
            {
                this.parent( x,y, settings );

                this.addAnim( 'idle', 1, [0] );
                this.addAnim( 'run', 0.15, [0,1,2,3,4] );
                this.addAnim( 'jump', 1, [0] );
                this.addAnim( 'fall', 1, [0] );	

                this.currentAnim = this.anims.idle;

                this.origin = { x: x, y: y };

                this.accel.x = 200;
            },
            update: function()
            {
                if (!this.sightBox) //if it hasnt been created yet (can't put this in init because weltmeister cant execute this when placing entity)
                    this.sightBox = ig.game.spawnEntity(EntitySightBox, this.pos.x, this.pos.y, { owner: this, size: this.sightSize });

                if (this.playerIsInSight) { //move blob toward player
                    if (this.pos.x > ig.game.player.pos.x ) {
                        this.accel.x = -200;
                        this.flip = true;
                    } else {
                        this.accel.x = 200;
                        this.flip = false;
                    }//if-else

                    this.maxVel = {x:175, y:300}
                } else { //move blob back and forth
                    if (this.pos.x > this.origin.x + this.domain) {
                        this.accel.x = -200;
                        this.flip = true;
                    } else if (this.pos.x < this.origin.x - this.domain) {
                        this.accel.x = 200;
                        this.flip = false;
                    }//if-else

                    this.maxVel = {x:75, y:300}

                    // turns around when hitting wall
                    var mx = this.vel.x * ig.system.tick;
                    var my = this.vel.y * ig.system.tick;
                    var res = ig.game.collisionMap.trace( 
                        this.pos.x, this.pos.y, mx, my, this.size.x, this.size.y
                    );

                    if( res.collision.x ) {// turns around when hitting wall
                        this.accel.x = -this.accel.x;
                        this.flip = !this.flip; //reverse flip
                    }//if

                }//if-else


                // before this is added animation doesn't change -
                // set the current animation, based on the player's speed
                if( this.vel.y < 0 ) 
                    this.currentAnim = this.anims.jump;
                else if( this.vel.y > 0 ) 
                    this.currentAnim = this.anims.fall;
                else if( this.vel.x != 0 ) // impact will change sprite automatically
                    this.currentAnim = this.anims.run;
                else
                    this.currentAnim = this.anims.idle;

                // check to see if the flip needs to change (true/false)
                this.currentAnim.flip.x = this.flip;


                // finally activate the move
                this.parent();
            },

            check: function(other) {
                if (!(other instanceof EntityPlayer && other.isDropKicking)) {//DON'T DO ANYTHING IF IT IS A PLAYER AND IT IS DROPKICKING
                    //knockback
                    let thisCenter = { x: this.pos.x + (this.size.x / 2), y: this.pos.y + (this.size.y / 2) };
                    let otherCenter = { x: other.pos.x + (other.size.x / 2), y: other.pos.y + (other.size.y / 2) };

                    let diff = { x: otherCenter.x - thisCenter.x, y: otherCenter.y - thisCenter.y };
                    let diffMagnitude = { x: Math.abs(diff.x), y: Math.abs(diff.y) };

                    let percent = { x: diffMagnitude.x / (diffMagnitude.x + diffMagnitude.y), y: diffMagnitude.y / (diff.x + diffMagnitude.y) };

                    other.vel.x += percent.x * (diff.x > 0 ? 100 : -100); //push right if other is right of blob, left otherwise
                    other.vel.y += percent.y * (diff.y > 0 ? 100 : -100); //push up if other is up of blob, down otherwise

                    this.vel.x += percent.x * (diff.x > 0 ? -100 : 100); //push right if other is right of blob, left otherwise
                    this.vel.y += percent.y * (diff.y > 0 ? -100 : 100); //push up if other is up of blob, down otherwise

                    other.receiveDamage(1, this);
                }
            },

        });

});