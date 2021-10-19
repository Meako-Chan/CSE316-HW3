import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { useHistory } from 'react-router-dom'
import React, { useEffect, useState } from "react";
/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();
    const [openList, setOpenList] = useState(false);
    const [canUndoActive, setCanUndoActive] = useState(false);
    
    let enabledButtonClass = "top5-button";
    useEffect(() => {
        isCloseDisabled();
        isUndoRedoDisabled();
    }, [store.currentList, store.isItemEditActive]);   

    function isUndoRedoDisabled() {
        if (store.isItemEditActive){
            console.log("Item is active. Undo and Redo disabled!");
            setCanUndoActive(true);
        }
        else {
            setCanUndoActive(false);
        }
    }

    function isCloseDisabled(){
        if (store.currentList !== null && (store.listMarkedForDeletion==null)){
            setOpenList(true);
        }
        else {
            setOpenList(false);
        }
    }
    function handleUndo() {
        if (!store.isItemEditActive){
            store.undo();
            console.log(store.hasRedo());
        }
    }
    function handleRedo() {
        if (!store.isItemEditActive){
            store.redo();
            console.log(store.hasRedo());
        }
    }
    function handleClose() {
        if (store.currentList && (store.listMarkedForDeletion==null) && (!store.isItemEditActive)) {
        history.push("/");
        store.closeCurrentList();
        }
    }
    let editStatus = false;
    if (store.isListNameEditActive) {
        editStatus = true;
    }
    return (
        <div id="edit-toolbar">
            <div
                disabled={editStatus}
                id='undo-button'
                onClick={handleUndo}
                className={(store.hasUndo() && !canUndoActive) ? enabledButtonClass : "top5-button-disabled" }>
                &#x21B6;
            </div>
            <div
                disabled={editStatus}
                id='redo-button'
                onClick={handleRedo}
                className={(store.hasRedo() && !canUndoActive) ? enabledButtonClass : "top5-button-disabled"}>
                &#x21B7;
            </div>
            <div
                disabled={editStatus}
                id='close-button'
                onClick={handleClose}
                className={(openList && !canUndoActive ) ? enabledButtonClass : "top5-button-disabled"}>
                &#x24E7;
            </div>
        </div>
    )
}

export default EditToolbar;