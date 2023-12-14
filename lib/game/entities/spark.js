ig.module(
    'game.entities.spark'
)
    .requires(
    'impact.entity'
)
    .defines (function() {
    EntitySpark = ig.Entity.extend({
        size: {x: 2, y: 2},
        maxVel: {x: 100, y: 100},
        lifetime: 2,
        fadetime: 1,
        
        vel: {x: 100, y: 100},
        colorOffset: 0,
        totalColors: 7,
        animSheet: new ig.AnimationSheet( 'media/sparks.png', 2, 2 ),
        
        init: function( x, y, settings ) {
            this.parent( x, y, settings );
            var frameID = Math.round(Math.random()*this.totalColors);
            this.addAnim( 'idle', 0.2, [frameID] );
                        
            this.vel.x = (Math.random() * 2 - 1) * this.vel.x;
            this.vel.y = (Math.random() * 2 - 1) * this.vel.y;
            this.idleTimer = new ig.Timer();
        },
        update: function() {
            if( this.idleTimer.delta() > this.lifetime ) {
                this.kill();
                return;
            }
            this.currentAnim.alpha = this.idleTimer.delta().map(
                this.lifetime - this.fadetime, this.lifetime,
                1, 0
            );
            this.parent();
        }
    });
});