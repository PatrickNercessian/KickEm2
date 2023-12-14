ig.module(
    'game.entities.heart'
)
    .requires(
    'impact.entity'
)
    .defines (function() {
    EntityHeart = ig.Entity.extend({        
        animSheet: new ig.AnimationSheet( 'media/heart.png', 32, 32 ),
        size: { x: 32, y: 32 },
        maxVel: {x: 0, y: 0},
        
        index: 0, //index in heart array
        
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            
            this.addAnim( 'full', 1, [0], true ); //stops
            this.addAnim( 'empty', 1, [1], true);
            
            this.index = settings.index;
        },

        update: function() {
            
            this.pos = { x: ig.game.screen.x + 16, y: ig.game.screen.y + ig.system.height - 45 }; //bottom left corner of screen
            
            this.pos.x += this.index * 40; //move over depending on what index
            
            this.parent();
            
        }, //so it doesn't draw graphics

    }); 
});