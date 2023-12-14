ig.module(
    'game.entities.vine'
)
    .requires(
    'impact.entity'
)
    .defines (function() {
    EntityVine = ig.Entity.extend({
        animSheet: new ig.AnimationSheet( 'media/vine.png', 128, 128 ),
        size: { x: 48, y: 48 },
        offset: { x: 0, y: 64 },
        maxVel: {x: 0, y: 0},

        checkAgainst: ig.Entity.TYPE.A,

        vineEndOffset: null,

        swingTimer: null,
        
        coolDownTimer: null,

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.addAnim( 'swingRight', 0.1, [0,1,2,3,4,5,6,7,8], true ); //stops
            this.addAnim( 'onLeft', 1, [0]);

            this.addAnim( 'swingLeft', 0.1, [8,7,6,5,4,3,2,1,0], true); //stops
            this.addAnim( 'onRight', 1, [8]);

            this.currentAnim = this.anims.onLeft;

            this.vineEndOffset = { x: 7, y: 87 };
            
            this.coolDownTimer = new ig.Timer();
        },

        update: function() {
            if (this.swingTimer) {
                switch (this.currentAnim.tile) {
                    case 0: this.vineEndOffset = { x: 7, y: 87 };break;
                    case 1: this.vineEndOffset = { x: 14, y: 105 };break;
                    case 2: this.vineEndOffset = { x: 26, y: 115 };break;
                    case 3: this.vineEndOffset = { x: 47, y: 122 };break;
                    case 4: this.vineEndOffset = { x: 63, y: 124 };break;
                    case 5: this.vineEndOffset = { x: 79, y: 122 };break;
                    case 6: this.vineEndOffset = { x: 100, y: 115 };break;
                    case 7: this.vineEndOffset = { x: 113, y: 105 };break;
                    case 8: this.vineEndOffset = { x: 121, y: 87 };break;
                }//switch

                if (this.swingTimer.delta() <= 0.1*9) { //if swing is ongoing
                    ig.game.player.vel.x = ((this.pos.x-this.offset.x + this.vineEndOffset.x) - ig.game.player.pos.x) * 5;
                    ig.game.player.vel.y = ((this.pos.y-this.offset.y + this.vineEndOffset.y) - ig.game.player.pos.y) * 5;
                } else { //if swing has ended
                    if (this.currentAnim === this.anims.swingRight) {
                        this.currentAnim = this.anims.onRight;
                        
                        this.offset = { x: 80, y: 64 };
                        this.pos.x += 80; //otherwise, whole entity moves to make up for changing offset
                        
                        this.vineEndOffset = { x: 121, y: 87 };
                        ig.game.player.vel = { x: 200, y: -300};
                        ig.game.player.hasControl = true;
                        ig.game.player.isSwinging = false;
                    } else if (this.currentAnim === this.anims.swingLeft) {
                        this.currentAnim = this.anims.onLeft;
                        
                        this.offset = { x: 0, y: 64 };
                        this.pos.x -= 80; //otherwise, whole entity moves to make up for changing offset
                        
                        this.vineEndOffset = { x: 7, y: 87 };
                        ig.game.player.vel = { x: -200, y: -300};
                        ig.game.player.hasControl = true;
                        ig.game.player.isSwinging = false;
                    }//if-else
                    
                    this.swingTimer = null;
                    this.coolDownTimer = new ig.Timer();
                    this.checkAgainst = ig.Entity.TYPE.A;
                }//if-else
            }//if

            this.parent();
        },


        check: function(other) {
            if (other instanceof EntityPlayer && this.coolDownTimer.delta() > 0.8) { //only swing player and only if it hasnt been swung in 0.8 sec
                other.hasControl = false; //player can't move during swing
                other.isSwinging = true;
                if (this.currentAnim === this.anims.onLeft)
                    this.currentAnim = this.anims.swingRight;
                else if (this.currentAnim === this.anims.onRight)
                    this.currentAnim = this.anims.swingLeft;
                
                this.currentAnim.gotoFrame(0);

                this.checkAgainst = ig.Entity.TYPE.NONE; //stop checking collision while swinging

                this.swingTimer = new ig.Timer();
            }//if
        },
        
        receiveDamage: function( amount, from ) {} //can't lose health

    }); 
});