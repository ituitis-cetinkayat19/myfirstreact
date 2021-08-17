import React from 'react';
import ReactDOM from 'react-dom';
import "./index.css";


class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      planets: [],
      attribute: "name",
      all: false
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
      </div>
    );
  }
}


ReactDOM.render(<MyComponent />, document.getElementById('root'));