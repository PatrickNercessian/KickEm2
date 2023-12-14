ig.module(
    'game.entities.water'
)
    .requires(
    'impact.entity'
)
    .defines (function() {
    EntityWater = ig.Entity.extend({
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(0, 0, 255, 0.4)',
        size: {x: 128, y: 128},
        checkAgainst: ig.Entity.TYPE.A,

        update: function() {}, //so it doesn't draw graphics

        check: function( other ) {
            if(other instanceof EntityPlayer){
                other.maxVel = {x: 150, y: 150}
                if (other.vel.y > 150) other.vel.y = 150; //velocity only capped by maxvel if it's already below it, this fixes that
                other.gravityPercent = 0.33;
                other.inWater = true;
            }//if
        }//check(other)

    }); 
});
