ig.module(
    'game.entities.portal'
)
    .requires(
    'impact.entity'
)
    .defines (function() {
    EntityPortal = ig.Entity.extend({
        animSheet: new ig.AnimationSheet( 'media/portal.png', 64, 64 ),
        size: { x: 16, y: 56 },
        offset: { x: 24, y: 4 },
        maxVel: {x: 0, y: 0},

        checkAgainst: ig.Entity.TYPE.A,

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.addAnim( 'idle', 0.3, [0,1,2,3,4] );

        },

        check: function(other) {
            ig.game.loadLevel(LevelIceLevel);
        },


        receiveDamage: function( amount, from ) {} //can't lose health

    }); 
});