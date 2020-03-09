import {RadialChart} from 'react-vis';
import {DiscreteColorLegend} from 'react-vis';

const Charts = props => (
  <div className="chartWrap">
    <RadialChart
    data={props.items}
    width={350}
    height={350} 
    radius={150}
    padAngle={0.1}
    innerRadius={100}
    showLabels
    labelsStyle={{
      fontSize: 10,
      fontFamily: "Arial",
      fontWeight: "bold",
      letterSpacing: 0.4
    }}
    labelsRadiusMultiplier={0.95}
  />
  {props.legend ? 
    <div>
      <DiscreteColorLegend
      width={350}
        items={props.items}
        orientation='horizontal'
        onItemClick={(item) => {
          //console.log("item", item);
        }}
      /> 
    </div>
  : ''}
  </div>
)

export default Charts;