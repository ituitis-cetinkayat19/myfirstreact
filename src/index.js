import React from 'react';
import ReactDOM from 'react-dom';
import "./index.css";

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      planets: [],
      attribute: "name",
      all: false,
      updateid: 0,
      datahost: process.env.REACT_APP_DATAHOST || "http://localhost:2000"
    };
  }  
  componentDidMount() {
    fetch(this.state.datahost+"/all")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({planets: result});
        }
      )
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  changeAttribute = (newAttribute) => {
    this.setState({
      attribute: newAttribute,
      all: false
    });
  }

  printTable = () => {
  return(
    <div>
<table>
<tbody>
  <tr>
      <th>ID</th>
      <th>{this.state.attribute}</th>
  </tr>
{this.state.planets.map(planet => (
    <tr>
      <td>{planet.id}</td>
      <td>{planet[this.state.attribute]}</td>
    </tr>
))}
</tbody>
</table>
</div>
);
  }

  deleteData = (number) =>{
    let txt = {"number":number};
    fetch(this.state.datahost+"/delete", {
      method: "DELETE",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(txt)
    })
    .then(res => res.json())
    .then((result) => {
        console.log("Response:", result);
        fetch(this.state.datahost+"/all")
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({planets: result});
          }
        )
        .catch((error) => {
          console.error('Error:', error);
        });        
      }
    )
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  showAll = () => {
    this.setState({
      all: true
    });
  }

  fillForm = (planet) => {
    var form = document.querySelector("#form2");
    for (let x in planet)
    {
      if(x !== "id")
      {
      if(form[x].type !== "checkbox")
        form[x].value = planet[x];
      else if(planet[x] === 1)
        form[x].checked = true;
      else
        form[x].checked = false;
      form[x].readOnly = false;
      }
    }
    this.setState({
      updateid: planet.id
    });
  }

  printAll = () => {
    return(
      <div>
  <table>
  <tbody>
  <tr>
        {Object.keys(this.state.planets[0]).map(properties => (
          <th>{properties === "id" ? properties.toUpperCase() : properties}</th>
        ))
      }
      <th>DELETE</th>
      <th>UPDATE</th>
  </tr>

  {this.state.planets.map(planet => (
    <tr>
    {Object.keys(planet).map(properties => (
      <td>{planet[properties]}</td>
  ))}
      <td><button id="delete" onClick={() => this.deleteData(planet.id)}>DELETE</button></td>
      <td><button id="update" onClick={() => this.fillForm(planet)}>UPDATE</button></td>
   </tr>
  ))}

  </tbody>
  </table>
  </div>
  );
  }

  serialize(data) {
    let obj = {};
    for (let [key, value] of data) {
      if (obj[key] !== undefined) {
        if (!Array.isArray(obj[key])) {
          obj[key] = [obj[key]];
        }
        obj[key].push(value);
      } else {
        obj[key] = value;
      }
    }
    return obj;
  }

  updateTable(event){
    event.preventDefault();
    let form = document.querySelector('#form2');
    let data = new FormData(form);
    let formObj = this.serialize(data);
    formObj.id = this.state.updateid;
    fetch(this.state.datahost+"/update", {
      method: "PUT",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formObj)
    })
    .then(res => res.json())
    .then((result) => {
        console.log("Response:", result);
        fetch(this.state.datahost+"/all")
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({planets: result});
          }
        )
        .catch((error) => {
          console.error('Error:', error);
        });        
      }
    )
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    let form = document.querySelector('#form');
    let data = new FormData(form);
    let formObj = this.serialize(data);
    fetch(this.state.datahost+"/add", {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formObj)
    })
    .then(res => res.json())
    .then((result) => {
        console.log("Response:", result);
        fetch(this.state.datahost+"/all")
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({planets: result});
          }
        )
        .catch((error) => {
          console.error('Error:', error);
        });        
      }
    )
    .catch((error) => {
      console.error('Error:', error);
    });
  }
  
  render() {
    return (
      <div id="body">
      <button onClick={() => this.changeAttribute("name")}>Name</button>
      <button onClick={() => this.changeAttribute("color")}>Color</button>
      <button onClick={() => this.changeAttribute("num_of_moons")}>Num. of Moons</button>
      <button onClick={() => this.changeAttribute("mass")}>Mass / Earth's mass</button>
      <button onClick={() => this.changeAttribute("rings")}>Ring</button>
      <button onClick={() => this.showAll()}>All</button>
      {this.state.all ? <this.printAll /> : <this.printTable />}
      <div id="forms">
      <form id="form" onSubmit={this.handleSubmit.bind(this)}>
        <h1>INSERT PLANET</h1>
        <input type="text" name = "name" placeholder="Enter planet name"/><br/>
        <input type="text" name = "color" placeholder="Enter planet color"/><br/>
        <input type="text" name = "num_of_moons" placeholder="Enter num. of moons"/><br/>
        <input type="text" name = "mass" placeholder="Enter mass/Earth's mass"/><br/>
        <label>Ring:</label><br/>
        <input type="checkbox" name = "rings"/><br/>
        <input type="submit" value = "Submit"/>
      </form>
      <form id="form2" onSubmit={this.updateTable.bind(this)}>
        <h1>UPDATE PLANET</h1>
        <input type="text" name = "name" placeholder="Enter planet name" readOnly/><br/>
        <input type="text" name = "color" placeholder="Enter planet color" readOnly/><br/>
        <input type="text" name = "num_of_moons" placeholder="Enter num. of moons" readOnly/><br/>
        <input type="text" name = "mass" placeholder="Enter mass/Earth's mass" readOnly/><br/>
        <label>Ring:</label><br/>
        <input type="checkbox" name = "rings" readOnly/><br/>
        <input type="submit" value = "Submit"/>
      </form>
      </div>
      </div>
    );
  }
}


ReactDOM.render(<MyComponent />, document.getElementById('root'));
