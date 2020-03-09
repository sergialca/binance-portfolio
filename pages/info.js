import Head from '../components/head';
import Nav from '../components/nav';

const Info = props => (
  <div>
    <Head title="Info" />
    <Nav />
    <div className="hero">
      <h1>Information about this project</h1>
    </div>
    <style jsx>{`
      .hero {
        text-align:center;
        color: #333;
        padding: 20px;
      }
    `}</style>
  </div>
)

export default Info;