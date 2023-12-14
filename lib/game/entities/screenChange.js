ig.module(
    'game.entities.screenChange'
)
    .requires(
    'impact.entity'
)
    .defines (function() {
    EntityScreenChange = ig.Entity.extend({
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(0, 0, 255, 0.4)',
        size: {x: 128, y: 128},
        checkAgainst: ig.Entity.TYPE.A,

        goal: { width: 1400, height: 800, scale: 1},

        update: function() {}, //so it doesn't draw graphics

        check: function( other ) {
            if(other instanceof EntityPlayer){
                /*
                if (ig.system.width < 1400)
                    ig.system.width *= 1.01;
                else
                    ig.system.width = 1400;

                if (ig.system.height < 800)
                    ig.system.height *= 1.01;
                else
                    ig.system.height = 800;

                if (ig.system.scale > 1)
                    ig.system.scale *= 0.99;
                else
                    ig.system.scale = 1;
                    */
                /*
                ig.system.fps = 60;

                ig.system.clock = new ig.Timer();
                ig.system.canvas = ig.$('#canvas');
                ig.system.resize( 1400, 800, 1 );
                ig.system.context = ig.system.canvas.getContext('2d');

                ig.system.getDrawPos = ig.System.drawMode;

                // Automatically switch to crisp scaling when using a scale
                // other than 1
                if( ig.system.scale != 1 ) {
                    ig.System.scaleMode = ig.System.SCALE.CRISP;
                }
                ig.System.scaleMode( ig.system.canvas, ig.system.context );
                */
         //       ig.main( '#canvas', MyGame, 60, 1400, 800, 1 );

            }//if
        }//check(other)

    }); 
});
