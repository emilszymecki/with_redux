import {getTodos,createTodo,updateTodo,destroyTodo} from '../lib/todoServices'
import {showMessage} from './messages'

const initState = {
  todos: [],
   currentTodo: ''
}

export const TODO_ADD = 'TODO_ADD'
export const TODOS_LOAD = 'TODOS_LOAD'
const CURRENT_UPDATE = 'CURRENT_UPDATE'
export const TODO_REPLACE = 'TODO_REPLACE'
export const TODO_DELETE = 'TODO_DELETE'

export const updateCurrent = (val) => ({type:CURRENT_UPDATE, payload: val})
export const loadTodos = (todos) => ({type: TODOS_LOAD, payload: todos})
export const addTodo = (todo) => ({type: TODO_ADD, payload: todo})
export const replaceTodo = (todo) => ({type:TODO_REPLACE, payload:todo})
export const deleteTodo = (id) => ({type:TODO_DELETE, payload:id})



export const fetchTodos = () => {
  return (dispatch) => {
  	dispatch(showMessage(`Wczytuje ...`))
    getTodos()
      .then(todos => dispatch(loadTodos(todos)))
      .then(() => {
  			setTimeout(() => {
  			  dispatch(showMessage(``))
  			}, 1000)
      })


  }
}

export const saveTodo = (name) => {
  return (dispatch) => {
  	dispatch(showMessage(`Zapisano akcje ${name}`))
    createTodo(name)
      .then(res => dispatch(addTodo(res)))

      setTimeout(() => {
	    dispatch(showMessage(``))
	  }, 1000)  
    
  }

}

export const toggleTodo = (id) => {
  return (dispatch,getState) => {
  	dispatch(showMessage(`Zaktualizowano ${id}`))
  	const {todos} = getState().todo
  	const todo = todos.find(t => t.id === id)
  	const togled = {...todo, isComplete: !todo.isComplete} 

    updateTodo(togled)
      .then(res => dispatch(replaceTodo(res)))

      setTimeout(() => {
	    dispatch(showMessage(``))
	  }, 1000)  
  }
}

export const removeTodo = (id) => {
  return (dispatch) => {
  	dispatch(showMessage(`Usunięto ${id}`))
    destroyTodo(id)
      .then( () => dispatch(deleteTodo(id)))

      setTimeout(() => {
	    dispatch(showMessage(``))
	  }, 1000)  
  }
}



export const getVisibleTodos = (todos,filter) => {
	switch(filter){
		case 'active':
			return todos.filter(t => !t.isComplete)
		case 'completed':
			return todos.filter(t =>  t.isComplete)
		default:
			return todos
	}
}

export default (state = initState, action) => {
  switch (action.type) {
    case TODO_ADD:
      return {...state, currentTodo: '', todos: state.todos.concat(action.payload)}
    case TODOS_LOAD:
      return {...state, todos: action.payload}
    case TODO_REPLACE:
      return {...state, todos: state.todos.map(t => t.id === action.payload.id ? action.payload:t)}
    case CURRENT_UPDATE:
      return {...state, currentTodo: action.payload}
    case TODO_DELETE:
      return {...state, todos: state.todos.filter(t => t.id !== action.payload )}  
    default:
      return state
  }
}