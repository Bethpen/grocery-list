import React, { useState, useEffect } from 'react'
import List from './List'
import Alert from './Alert'

const getLocalStorage = () => {
  let list = localStorage.getItem('list');
  if (list) {
    return JSON.parse(list)
  }
  else {
    return []
  }
}


function App() {
  const [name, setName] = useState('');
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null)
  const [alert, setAlert] = useState({ show: false, type: '', msg: '' });


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      showAlert(true, 'danger', 'please fill this field');

    } else if (name && isEditing) {
      showAlert(true, 'success', 'item has been edited ');
      setList(list.map((item) => {
        if (item.id === editId) {
          return { ...item, title: name }
        }
        return item
      })
      )
      setName('');
      setEditId(null);
      setIsEditing(false);

    } else {
      showAlert(true, 'success', 'item added succesfully ');
      const newItem = {
        id: new Date().getTime().toString(),
        title: name
      };
      setList([
        ...list,
        newItem
      ]);
      setName('')
    }
  }


  const showAlert = (show = false, type = '', msg = '') => {
    setAlert({ show, type, msg })
  }

  const removeItem = (id) => {
    showAlert('true', 'danger', 'item removed ')
    setList(list.filter((item) => item.id !== id))
  }

  const deleteList = () => {
    showAlert('true', 'danger', 'empty list')
    setList([]);
  }

  const editList = (id) => {
    const specificItem = list.find((item) => item.id === id)
    setIsEditing(true);
    setEditId(id);
    setName(specificItem.title)
  }

  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list))
  }, [list])

  return <section className='section-center'>
    <form onSubmit={handleSubmit} className="grocery-form">
      <p>{alert.show && <Alert {...alert} showAlert={showAlert} list={list} />}</p>
      <h3>Grocery List </h3>
      <div className="form-control">
        <input type="text" className='grocery' placeholder='e.g. eggs ' value={name} onChange={(e) => setName(e.target.value)} />
        <button className='submit-btn'>{isEditing ? 'Edit' : 'Add '}</button>
      </div>
    </form>
    <div className="grocery-container">
      <List removeItem={removeItem} editList={editList} items={list} />
      <button onClick={deleteList} className="clear-btn">{(list.length > 0) && 'clear items'}</button>
    </div>
  </section>
}

export default App
