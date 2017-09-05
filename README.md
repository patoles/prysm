# Prysm (Work in progress)

Use GLSL shaders on your DOM containers easily.

### Usage
```Javascript
import Prysm from 'prysm';

var target = document.getElementById('test');
var options = {
    fragment:"water",
    params:{
        fragment:{
            speed:0.02,
            amplitude:10.1,
            refraction:0.8,
            width:0.12
        }
    }
};

new Prysm(target, options);
```

#### Options

|Name | Type | Description | Default value | Possible value |
| --- | --- | --- | --- | -- |
| fragment | `string` | Fragment shader's name | 'default' | 'default', 'shockwave', 'water' |
| vertex | `string` | Vertex shader's name | 'default' | 'default', 'water' |
| params | `Object` | Define the shader's parameters | {} | fragment:{params}, vertex:{params} |
