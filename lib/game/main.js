ig.module( 
    'game.main' 
)
    .requires(
    'impact.game',
    'impact.font',

    'game.levels.level1',
    'game.levels.iceLevel',
    'game.levels.lavaLevel',
    'game.entities.player',
    'game.entities.parallax'
)
    .defines(function(){

    MyGame = ig.Game.extend({
        //lava knight inspiration
// https://brashmonkey.com/forum/index.php?/topic/3229-metroidvania-game-pixel-art-style/page/2/
        // Load a font
        font: new ig.Font( 'media/04b03.font.png' ),

        player: null,

        gravity: 650,

        currentLevel: null,

        parallaxes: [],

        loadLevel: function( data ) {
            this.currentLevel = data;
            this.parent( data );
        },

        init: function() {

            //music
            ig.music.add( 'media/audio/yeet.ogg' );
            ig.music.volume = 0.5;
            ig.music.play();

            // Initialize your game here; bind keys etc.
            ig.input.bind(ig.KEY.A, 'left');
            ig.input.bind(ig.KEY.D, 'right');
            ig.input.bind(ig.KEY.S, 'down');
            ig.input.bind(ig.KEY.SPACE, 'jump');
            ig.input.bind(ig.KEY.Q, 'meleeKick');
            ig.input.bind(ig.KEY.W, 'dropKick');
            ig.input.bind(ig.KEY.E, 'energyOrb'); //spawns energy ball below player and raises player. Once ready, kick the ball to launch it forward
            ig.input.bind(ig.KEY.M, 'musicPlay');

            this.loadLevel( LevelLevel1 ); // same name as file
            //  this.loadLevel( LevelIceLevel );
            //    this.loadLevel( LevelLavaLevel );

        },

        update: function() {
            
            // screen follows the player
            var player = this.getEntitiesByType( EntityPlayer )[0];
            if( player ) {
                this.screen.x = player.pos.x + (player.size.x + player.offset.x)/2 - ig.system.width/2;
                this.screen.y = player.pos.y + (player.size.y + player.offset.y)/2 - ig.system.height/2;


                //keeping camera within level bounds
                let collisionMap = ig.game.collisionMap;
                if (this.screen.x < 0) this.screen.x = 0;
                if (this.screen.x + ig.system.width > collisionMap.width * collisionMap.tilesize) this.screen.x = 4800 - ig.system.width;
                if (this.screen.y < 0) this.screen.y = 0;
                if (this.screen.y + ig.system.height > collisionMap.height * collisionMap.tilesize) this.screen.y = 1024 - ig.system.height;

            }
            // Update all entities and BackgroundMaps
            this.parent();
        },

        draw: function() {
            // Draw all entities and backgroundMaps
            this.parent();

        }
    });


    // Start the Game with 60fps, a resolution of 320x240, scaled
    // up by a factor of 2
    ig.main( '#canvas', MyGame, 60, 700, 400, 2 );

});
