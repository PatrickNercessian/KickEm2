ig.module(
    'game.entities.sparkExplosion'
)
    .requires(
    'impact.entity',
    'game.entities.spark'
)
    .defines (function() {
    EntitySparkExplosion = ig.Entity.extend({
        lifetime: 1,
        callBack: null,
        particles: 50,
        init: function( x, y, settings ) {
            this.parent( x, y, settings );
            for(let i = 0; i < this.particles; i++)
                ig.game.spawnEntity(EntitySpark, x, y);

            this.idleTimer = new ig.Timer();
        },
        update: function() {
            if( this.idleTimer.delta() > this.lifetime ) {
                this.kill();
                if(this.callBack)
                    this.callBack();
                return;
            }
        }
    });
});