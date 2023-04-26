import { GithubUser } from "./GithubUser.js"

export class Favorites {
  constructor (root){
    this.root=document.querySelector(root)
    this.load()
  }
load(){
  this.entries = JSON.parse(localStorage.getItem ('@github-favorites')) || []
   
  }

  save(){
    localStorage.setItem('@github-favorites',JSON.stringify(this.entries))
  
  }

  async add(username){
    try{
    const user = await GithubUser.search(username)
    const userexists= this.entries.find(entry => entry.login === username)
    
    if(userexists){
     throw new Error('usuario ja cadastrado')
    }

    if(user.login === undefined){
      throw new Error('Usuario nao encontrado')
    }


    this.entries = [user, ...this.entries]
    this.update()
    this.save()

   }catch(error){
    alert(error.messsage)

   }
  }

  delete(user){
    const filteredEntries = this.entries.filter(entry=>entry.login !== user.login)
    this.entries = filteredEntries
    this.update()
    this.save()
   
  }
}

export class FavoritesView extends Favorites{
  constructor(root){
   super(root)
   this.tbody= this.root.querySelector('table tbody')
   this.update()
   this.onadd()
  }

   onadd(){
    const addButton= this.root.querySelector('.search button')
    addButton.onclick = () => {
      const {value} = this.root.querySelector('.search input')
      this.add(value)
    
    
    }
  }


   update(){
    this.RemoveAllTr()
 
    this.entries.forEach(user => {
    const row = this.CeateRow()
    row.querySelector('.user img').alt = 'imagem do usuario'
    row.querySelector('.user p').textContent = user.name
    row.querySelector('.user span').textContent = user.login
    row.querySelector('.followers').textContent = user.followers
    row.querySelector('.repositories').textContent = user.public_repos
    row.querySelector('.user a').href = `https://github.com/${user.login}`
    row.querySelector('.user img').src = `https://github.com/${user.login}.png`
    
    row.querySelector('.remove').onclick = () =>{
      const isok =  confirm('deseja mesmo deletar este usuario?')
      if(isok){
        this.delete(user)
        window.location.reload()
      }
    }
    
    this.tbody.append(row)
  })
 }


   
  RemoveAllTr(){
    
    this.tbody.querySelectorAll('tr')
     .forEach((tr) => {
      tr.remove()
     });
     
  }

 CeateRow(){
   const divremover = function () {
     const divremove = document.querySelector('.empyt')
     divremove.style.display='none'
   }
   divremover()
   const tr= document.createElement('tr')
  tr.innerHTML = `  
  <td class="user">
    <img src="https://github.com/rodrigosantos0660.png" alt="imagem de rodrigo">
    <a href="https://github.com/rodrigosantos0660" target="_blank">
      <p>Rodrigo Santos</p>
      <span>rodrigo santos</span>
    </a>
  </td>
  <td class="repositories">
    20
  </td>
  <td class="followers">
    10
  </td>
  <td>
    <button class="remove"> Remover </button>
  </td>
  
  `
  return tr
  }

}