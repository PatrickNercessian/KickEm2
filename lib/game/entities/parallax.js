ig.module(
    'game.entities.parallax'
)
    .requires(
    'impact.entity'
)
    .defines (function() {
    EntityParallax = ig.Entity.extend({

        //     animSheet: new ig.AnimationSheet( 'media/backMountainLayer.png', 1600, 340 ),
        percent: 0.5,

        pngFile: null,

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            //   this.percent = this.size.x / ig.game.collisionMap.width; //need to ensure y percent is the same

            this.percent = settings.percent;

            ig.game.parallaxes[ig.game.parallaxes.length] = this;

            /*
            this.size = settings.size;
            this.pngFile = settings.pngFile;
            this.animSheet = new ig.AnimationSheet( this.pngFile, this.size.x, this.size.y )*/
            this.animSheet = settings.animSheet;
            //    this.animSheet = new ig.AnimationSheet( 'media/backMountainLayer.png', 1600, 340 ),
            this.addAnim( 'idle', 1, [0], true );
            this.currentAnim = this.anims.idle;

        },

        update: function() {

        }, //use special update instead

        specialUpdate: function() { //called right before player actually moves
            let x = ig.game.screen.x * this.percent,
                y = (ig.game.screen.y - 240)* this.percent;

            this.pos.x = x;
            this.pos.y = y;
        },



        receiveDamage: function( amount, from ) {} //can't lose health

    }); 
});