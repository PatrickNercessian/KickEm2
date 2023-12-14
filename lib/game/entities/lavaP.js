ig.module(
    'game.entities.lavaP'
)
    .requires(
    'impact.entity'
)
    .defines (function() {
    EntityLavaP = ig.Entity.extend({
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(0, 0, 255, 0.4)',
        size: {x: 128, y: 128},
        checkAgainst: ig.Entity.TYPE.BOTH,

        update: function() {}, //so it doesn't draw graphics

        check: function( other ) {
            if (!(other instanceof EntityLavaSerpent))
                other.receiveDamage(2);
            else if (other.flyTimer)
                other.reachedLava = true;

            if(other instanceof EntityPlayer){
                other.maxVel = {x: 100, y: 100}
                if (other.vel.y > 100) other.vel.y = 100; //velocity only capped by maxvel if it's already below it, this fixes that
                other.gravityPercent = 0.33;
                other.inWater = true;
            }//if
        }//check(other)

    }); 
});
