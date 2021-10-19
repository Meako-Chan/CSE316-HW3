import { React, useContext, useState, useEffect } from "react";
import { useHistory } from 'react-router-dom'
import { GlobalStoreContext } from '../store'
/*
    This React component represents a single item in our
    Top 5 List, which can be edited or moved around.
    
    @author McKilla Gorilla
*/
function Top5Item(props) {
    const { store } = useContext(GlobalStoreContext);
    const [ editActive, setEditActive ] = useState(false);
    const [draggedTo, setDraggedTo] = useState(0);
    store.history = useHistory();
    // const { currentList, selected } = props;
    // const [ inputText, setText ] = useState(store.currentList.items);
    

    function handleDragStart(event) {
        if (store.isItemEditActive===false){
            event.dataTransfer.setData("item", event.target.id);
        }
        
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDragEnter(event) {
        event.preventDefault();
        setDraggedTo(true);
    }

    function handleDragLeave(event) {
        event.preventDefault();
        setDraggedTo(false);
    }
    function handleKeyPress(event) {
        event.stopPropagation();
        if(event.code === "Enter") {

           let id = event.target.id.substring("item-".length);
        //    console.log(event.target.value);
        //    console.log(store.currentList.items[id]);
        //    store.currentList.items[id] = event.target.value;   
           if(event.target.value !== store.currentList.items[id]){
           store.addChangeItemTransaction(id,event.target.value);
           }
           toggleEdit();
           store.updateCurrentList();
           
       }
   }
   function handleOnBlur(event) {
       console.log(event.target);
       if(event.target.className.includes("top5-button")){
           console.log("Top 5 button clicked");
       }
        let id = event.target.id.substring("item-".length);
        console.log(event.target.value);
        console.log(store.currentList.items[id]);
        store.currentList.items[id] = event.target.value;   

        if(event.target.value !== store.currentList.items[id]){
            store.addChangeItemTransaction(id,event.target.value);
            }
        store.updateCurrentList();
        toggleEdit();
}

    function handleDrop(event) {
        event.preventDefault();
        let target = event.target;
        let targetId = target.id;
        targetId = targetId.substring(target.id.indexOf("-") + 1);
        let sourceId = event.dataTransfer.getData("item");
        sourceId = sourceId.substring(sourceId.indexOf("-") + 1);
        setDraggedTo(false);

        // UPDATE THE LIST
        store.addMoveItemTransaction(sourceId, targetId);
    }
    function handleToggleEdit(event){
        // event.stopPropagation();
        console.log("ajsodflsaf "+editActive.toString());
        if (store.isItemEditActive){

        }
        else {
            toggleEdit();
        }
    }
    function toggleEdit() {
        console.log(editActive);
        let newActive = !editActive;
        // if(!store.isItemEditActive){
            if (newActive) {
                // console.log(editActive);
                setEditActive(newActive);
                store.setIsItemNameEditActive();
            }
            // store.setIsItemNameEditActive();
            setEditActive(newActive);
            console.log("Changed to "+newActive);
            
        // }
        // setEditActive(newActive);
        // console.log("Changed to "+newActive);
    }
    // function handleUpdateText(event){
    //     if(event.target.value === ""){
    //         event.target.value = " ";
    //     }
    //     //console.log(event.target.defaultValue);
    //     // setText(event.target.value);
    // }
    let { index } = props;
    let itemClass = "top5-item";
    if (draggedTo) {
        itemClass = "top5-item-dragged-to";
    }
    let cardStatus = false;
    if (store.isItemNameEditActive) {
        cardStatus = true;
    }
    let cardElement=
        <div
            id={'item-' + (index + 1)}
            className={itemClass}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            draggable={store.isItemEditActive ? "false" : "true"}
        >
            <input
                type="button"
                id={"edit-item-" + index + 1}
                className={store.isItemEditActive ? "list-card-button-disabled" : "list-card-button"  } 
                onClick={handleToggleEdit}
                value={"\u270E"}
            />
            {props.text}
        </div>
    if (editActive) {
        cardElement =
            <input
                id={"item-" + (index)}
                className='top5-item'
                type='text'
                onKeyPress={handleKeyPress}
                /*onChange={handleUpdateText}*/
                onBlur={handleOnBlur}
                defaultValue={store.currentList.items[index]}
                />;
        }
        return (
            cardElement
        );
}

export default Top5Item;