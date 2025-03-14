class node {
    constructor(game_state, parent = null) {
        this.state = game_state;
        this.parent = parent;
        this.childs = [];
        this.visits_counter = 0;
        this.win_counter = 0;

    }

    new_child(game_state){
        child = node(game_state,this);
        this.childs.push(child);
    }

    update_Win(){
        this.visits_counter++;
        this.win_counter++;
    }
    update_defeat(){
        this.visits_counter++;
    }

    UCT(C){
        return this.win_counter/this.visits_counter + C * Math.sqrt(Math.log(this.parent.visits_counter/this.visits_counter));
    }

    best_child(C){
        best_child = this.childs[0];
        best_UTC = this.best_chid.UCT(C);
        this.childs.forEach(element => {
            element_UTC = element.UCT(C)
            if (best_UTC < element_UTC) {
                best_child = element;
                best_UTC = element_UTC;
            }
        });
        return best_child;
    }
}
