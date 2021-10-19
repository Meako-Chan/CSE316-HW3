import { React, useContext, useState } from "react";
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
        event.dataTransfer.setData("item", event.target.id);
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
        if(event.code === "Enter") {

           let id = event.target.id.substring("item-".length);
        //    console.log(event.target.value);
        //    console.log(store.currentList.items[id]);
        //    store.currentList.items[id] = event.target.value;   
           
           store.addChangeItemTransaction(id,event.target.value);
           toggleEdit();
           store.updateCurrentList();
           
       }
   }
   function handleOnBlur(event) {
        let id = event.target.id.substring("item-".length);
        console.log(event.target.value);
        console.log(store.currentList.items[id]);
        store.currentList.items[id] = event.target.value;   
        toggleEdit();
        store.addChangeItemTransaction(id,event.target.value);
        store.updateCurrentList();
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
        event.stopPropagation();
        toggleEdit();
    }
    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsItemNameEditActive();
        }
        setEditActive(newActive);
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
            draggable="true"
        >
            <input
                type="button"
                id={"edit-item-" + index + 1}
                className="list-card-button"
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