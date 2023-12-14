ig.module(
    'game.entities.lavaSpit'
)
    .requires(
    'impact.entity'
)
    .defines (function() {
    EntityLavaSpit = ig.Entity.extend({
        animSheet: new ig.AnimationSheet( 'media/lavaSpit.png', 128, 128 ),
        size: { x: 32, y: 128 },
        offset: { x: 48, y: 0},
        maxVel: { x: 0, y: 400 },
        zIndex: -10,

        checkAgainst: ig.Entity.TYPE.A,

        owner: null,

        gravityFactor: 0,

        init: function(x, y, settings) {
            ig.game.sortEntitiesDeferred();
            this.parent(x, y, settings);

            this.addAnim( 'idle', 1, [0], true );

            this.vel.y = settings.yVel;
            this.owner = settings.owner;
        },

        update: function() {
            if (this.pos.y > ig.game.collisionMap.pxHeight || this.pos.y + this.size.y < 0)
                this.kill();

            
            // finally activate the move
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

            if (res.collision.x || res.collision.y) //explode if it hits a wall
                this.kill();

            this.handleMovementTrace( res );

            if(this.currentAnim)
                this.currentAnim.update();
        },

        check: function(other) {
            other.receiveDamage(1, this.owner)
            this.kill();
        },


        receiveDamage: function( amount, from ) {} //can't lose health

    }); 
});