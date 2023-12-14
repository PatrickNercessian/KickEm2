ig.module(
    'game.entities.hitbox'
)
    .requires(
    'impact.entity'
)
    .defines (function() {
    EntityHitbox = ig.Entity.extend({
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(0, 0, 255, 0.4)',
        size: {x: 64, y: 64},
        amount: 0,

        checkAgainst: ig.Entity.TYPE.B,

        isKick: false,

        startTime: 0, //when hitbox starts checking collision
        endTime: 1, //when hitbox dies
        lifeTimer: null, //timer to complement startTime and endTime

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.lifeTimer = new ig.Timer();

            this.amount = settings.amount;
            this.checkAgainst = settings.checkAgainst;
            this.size = settings.size;
            this.isKick = settings.isKick;

            this.startTime = settings.startTime;
            this.endTime = settings.endTime;
        },

        update: function() {
            if (this.lifeTimer.delta() > this.endTime)
                this.kill();
        }, //so it doesn't draw graphics

        check: function(other) {
            if (this.lifeTimer.delta() > this.startTime) {
                other.receiveDamage(this.amount);

                //launch forward energy orb if hitbox is a kick, it hits an energy orb, and it has already spawned
                if (this.isKick && other instanceof EntityEnergyOrb && other.currentAnim !== other.anims.spawning) {

                    if (ig.game.player.flip)
                        other.vel.x = -200;
                    else
                        other.vel.x = 200;
                }//if
            }//if

        }//check(other)

    }); 
});