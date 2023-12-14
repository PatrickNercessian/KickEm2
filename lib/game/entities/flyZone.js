ig.module(
    'game.entities.flyZone'
)
    .requires(
    'impact.entity'
)
    .defines (function() {
    EntityFlyZone = ig.Entity.extend({
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(0, 0, 255, 0.4)',
        size: {x: 128, y: 128},
        checkAgainst: ig.Entity.TYPE.A,

        update: function() {}, //so it doesn't draw graphics

        check: function( other ) {
            if(other instanceof EntityPlayer){
                other.maxVel = {x: 250, y: 250}
                other.gravityPercent = 0;
                other.isFlying = true;
            }//if
        }//check(other)

    }); 
});
