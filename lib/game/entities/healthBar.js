ig.module(
    'game.entities.healthBar'
)
    .requires(
    'impact.entity'
)
    .defines (function() {
    EntityHealthBar = ig.Entity.extend({        
        
        entity: null,
        
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            
            this.size = settings.size;
            
            this.entity = settings.entity;
        },

        update: function() {
            
        }, //so it doesn't draw graphics

    }); 
});