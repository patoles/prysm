# Prysm

Apply WebGL shaders on DOM elements easily.
[Demo1](https://codepen.io/patoles/pen/NvmJyN)
[Demo2](https://codepen.io/patoles/pen/mMgZMY)
[Demo3](https://codepen.io/patoles/pen/gxJQpQ)

![example-pic](http://res.cloudinary.com/dxlvclh9c/image/upload/c_scale,w_180/v1504679545/water_gif_ejbkqx.gif)

## Table of Contents
1. [Installation](#install)
2. [Usage](#usage)
3. [Examples](#examples)

<a name="install"></a>
### Installation

```cmd
npm install prysm
```
<a name="usage"></a>
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

##### Fragment Params

###### water / shockwave

|Name | type | Default value |
| --- | --- | --- |
| speed | float | 0.02 |
| amplitude | float | 10.1 |
| refraction | float | 0.8 | 
| width | float | 0.1 |

##### Vertex Params

###### water

|Name | type | Default value |
| --- | --- | --- |
| amplitude | float | 0.05 |
| frequency | float | 1.0 | 

<a name="examples"></a>
### Examples

[Water fragment/vertex shader](https://codepen.io/patoles/pen/NvmJyN)

[Shockwave fragment shader](https://codepen.io/patoles/pen/mMgZMY)

[Speaker sound wave](https://codepen.io/patoles/pen/gxJQpQ)
