'use strict';
export const fetchFormData = {
  geo: () => {
        return {
         startHeight : 0,
         finishHeight : 20,
         stepCount : 4,
         toleranceWidth : 6
        }
    }, 
  area: () => {
        return {
         stepCount : 10,
         angle : 4,
        }
    }, 
  slope: () => {
        return {
         stepCount: 4,
         startHeight: 0,
         finishHeight: 20,
         slopeAngle: 90,
        };
    }, 
    waypoint: () => {
        return {
         altitude: 20,
        };
    }, 
}

