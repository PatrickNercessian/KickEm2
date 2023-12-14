const SPAWN_FRAME_TIME = 0.2;

ig.module(
    'game.entities.energyOrb'
)
    .requires(
    'impact.entity',
    'game.entities.energyExplosion'
)
    .defines (function() {
    EntityEnergyOrb = ig.Entity.extend({
        animSheet: new ig.AnimationSheet( 'media/energy orb.png', 64, 64 ),
        size: { x: 48, y: 48 },
        offset: { x: 8, y: 8 },
        maxVel: { x: 400, y: 0 },
        type: ig.Entity.TYPE.B,

        checkAgainst: ig.Entity.TYPE.BOTH,

        spawnTimer: null,

        hasReset: false,

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.addAnim( 'spawning', SPAWN_FRAME_TIME, [0,1,2,3,4,5,6], true ); //stops
            this.addAnim( 'idle', SPAWN_FRAME_TIME, [7,8,9] );

            this.spawnTimer = new ig.Timer();
        },

        update: function() {
            let player = ig.game.player;
            if (!this.hasReset) {
                if (this.spawnTimer.delta() > 7 * SPAWN_FRAME_TIME) {
                    this.hasReset = true; //ensure this only happens once

                    this.currentAnim = this.anims.idle;
                    player.gravityPercent = 1;
                    player.anims.idle.angle = 0;

                    //rotate hitbox
                    player.size = { x: 41, y: 63};
                    player.offset = { x: 11, y: 1};
                    player.hasControl = true;


                } else {
                    this.currentAnim = this.anims.spawning;
                    player.gravityPercent = 0;
                    this.hasReset = false;
                }//if-else
            }//if



            // finally activate the move WITHOUT gravity
            this.last.x = this.pos.x;
            this.last.y = this.pos.y;
            //      this.vel.y += ig.game.gravity * ig.system.tick * this.gravityFactor;

            this.vel.x = this.getNewVelocity( this.vel.x, this.accel.x, this.friction.x, this.maxVel.x );
            this.vel.y = this.getNewVelocity( this.vel.y, this.accel.y, this.friction.y, this.maxVel.y );

            // movement & collision
            var mx = this.vel.x * ig.system.tick;
            var my = this.vel.y * ig.system.tick;
            var res = ig.game.collisionMap.trace( 
                this.pos.x, this.pos.y, mx, my, this.size.x, this.size.y
            );
            
            if (res.collision.x || res.collision.y) //explode if it hits a wall
                this.kill();
            else if (this.spawnTimer.delta() > 8) //explode after 8 seconds
                this.kill();
            
            this.handleMovementTrace( res );

            if(this.currentAnim)
                this.currentAnim.update();
        },


        check: function(other) {
            if (this.spawnTimer.delta() > 7 * SPAWN_FRAME_TIME) {//check collision only if finished spawning
                if (!(other instanceof EntityPlayer && other.isDropKicking)) //check collision only if player is not dropkicking it
                    this.kill();
            }//if
        },

        kill: function() {
            ig.game.spawnEntity(EntityEnergyExplosion, this.pos.x + this.size.x/2, this.pos.y + this.size.y/2)

            this.parent();
        },

        //also need to kill/explode on wall impact

        receiveDamage: function( amount, from ) {} //can't lose health

    }); 
});