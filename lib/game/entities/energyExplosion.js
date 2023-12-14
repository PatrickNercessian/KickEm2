ig.module(
    'game.entities.energyExplosion'
)
    .requires(
    'impact.entity'
)
    .defines (function() {
    EntityEnergyExplosion = ig.Entity.extend({
        animSheet: new ig.AnimationSheet( 'media/energy explosion.png', 128, 128 ),

        size: {x: 128, y: 128},
        maxVel: { x: 0, y: 0},

        checkAgainst: ig.Entity.TYPE.BOTH,

        spawnTimer: null,

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.pos.x -= this.size.x/2; //centering
            this.pos.y -= this.size.y/2; //centering


            this.addAnim( 'exploding', 0.1, [0,1,2,3,4,5,6], false ); //stops
            this.currentAnim = this.anims.exploding;

            this.spawnTimer = new ig.Timer();
        },

        update: function() {
            if (this.spawnTimer.delta() > 0.7)
                this.kill();

            this.parent();
        },


        check: function(other) {
            if (this.spawnTimer.delta() < 0.4) { //only damage in first 3 frames
                if (!(other instanceof EntityLavaSerpent)) {
                    //knockback
                    let thisCenter = { x: this.pos.x + this.size.x/2, y: this.pos.y + this.size.y/2 };
                    let otherCenter = { x: other.pos.x + other.size.x/2, y: other.pos.y + other.size.y/2 };

                    let diff = { x: otherCenter.x - thisCenter.x, y: otherCenter.y - thisCenter.y };
                    let diffMagnitude = { x: Math.abs(diff.x), y: Math.abs(diff.y) };

                    let percent = { x: diffMagnitude.x / (diffMagnitude.x + diffMagnitude.y), y: diffMagnitude.y / (diff.x + diffMagnitude.y) };

                    other.vel.x += percent.x * (diff.x > 0 ? 200 : -200); //push right if other is right of explosion, left otherwise
                    other.vel.y += percent.y * (diff.y > 0 ? 200 : -200); //push up if other is up of explosion, down otherwise
                }

                //damage
                if (other instanceof EntityPlayer)
                    other.receiveDamage(1);
                else
                    other.receiveDamage(2);
            }//if
        },

    }); 
});