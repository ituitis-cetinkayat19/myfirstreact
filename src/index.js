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
      form: {name:'test',}
    };
  }  
  componentDidMount() {
    fetch("http://localhost:2000/all")
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

  showAll = () => {
    this.setState({
      all: true
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
  </tr>


  {this.state.planets.map(planet => (
    <tr>
    {Object.keys(planet).map(properties => (
      <td>{planet[properties]}</td>
  ))}
   </tr>
  ))}

  </tbody>
  </table>
  </div>
  );
  }

  // https://gomakethings.com/how-to-serialize-form-data-with-vanilla-js/
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

  handleSubmit(event) {
    event.preventDefault();
    let form = document.querySelector('#form');
    let data = new FormData(form);
    let formObj = this.serialize(data);
    fetch("http://localhost:2000/add", {
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
      <h1>INSERT NEW PLANET</h1>
      <form id="form" onSubmit={this.handleSubmit.bind(this)}>
        <input type="text" name = "name" placeholder="Enter planet name"/><br/>
        <input type="text" name = "color" placeholder="Enter planet color"/><br/>
        <input type="text" name = "num_of_moons" placeholder="Enter num. of moons"/><br/>
        <input type="text" name = "mass" placeholder="Enter mass/Earth's mass"/><br/>
        <input type="text" name = "rings" placeholder="Enter ring"/><br/>
        <input type="submit" value = "Submit"/>
      </form>
      </div>
    );
  }
}


ReactDOM.render(<MyComponent />, document.getElementById('root'));