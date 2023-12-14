ig.module(
    'game.entities.sightBox'
)
    .requires(
    'impact.entity'
)
    .defines (function() {
    EntitySightBox = ig.Entity.extend({
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(0, 0, 255, 0.4)',
        size: {x: 256, y: 256},

        checkAgainst: ig.Entity.TYPE.A,

        owner: null,

        sawPlayerLastFrame: false,

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.owner = settings.owner;
            if (settings.size)
                this.size = settings.size;
        },

        update: function() {
            if (this.owner.flip)
                this.pos.x = this.owner.pos.x + this.owner.size.x - this.size.x;
            else
                this.pos.x = this.owner.pos.x;

            this.pos.y = this.owner.pos.y - (this.size.y / 2)

            if (!this.sawPlayerLastFrame) { //player not in sightbox
                this.owner.playerIsInSight = false;

            }//if

            this.sawPlayerLastFrame = false;

        }, //so it doesn't draw graphics

        check: function(other) {
            if(other instanceof EntityPlayer){
                this.sawPlayerLastFrame = true;
                if (!this.owner.playerIsInSight) {
                    if (this.owner.standing)
                        this.owner.vel.y -= 125;

                    this.owner.playerIsInSight = true;
                }//if
            }//if
        }//check(other)
    });
});