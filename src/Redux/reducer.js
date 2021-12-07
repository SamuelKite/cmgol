const appStore = {
    gridRows: []
}

const gridCellUpdateReducer = (store = appStore, action) => {
    switch (action.type) {
        case 'UPDATE_CELL':
            if (action.cell && action.cell.row && action.cell.col && gridRows.length > action.cell.row && gridRows[action.cell.row].length > action.cell.col)
                return { ...state, gridRows: gridRows[action.cell.row][action.cell.col] = action.cell }
        default:
            return store
    }
}