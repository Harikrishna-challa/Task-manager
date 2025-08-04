import React from 'react';
import {pieChart,Pie , Cell , Tooltip,ResponsiveContainer, PieChart} from 'recharts';

const STATUS_COLORS ={
    "TO Do" : "#FFBB28",
    "In Progress": "#0088FE",
    "Completed": "#00C49F",
};

const StatusPieChart =({tasks}) => {
    // prepare data for the pie chart
    const getStatusdata =() =>{
        const counts ={"To Do" : 0, "In Progress" : 0, "Completed": 0};
        tasks.forEach((task)=>{
            counts[task.status]= (counts[tasks.status] || 0) +1;
        });
        return Object.entries(counts).map(([name, value]) =>({name,value}));
    };
    const data = getStatusdata();
   return (
    <div>
        <h5>Task Distribution by Status</h5>
        <ResponsiveContainer>
            <PieChart>
                <Pie
                data ={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill='#8884d8'
                label
                >
                    {data.map((entry,index)=>(
                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#8884d8'} />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    </div>
   )}
   export default StatusPieChart