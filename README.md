# svt_robotics

Instructions to run.

1. Clone repository onto your local machine.

2. Run "npm i" inside the repo to download dependencies.

3. Edit arguments for the function at the bottom of index.js if you wish
   to use a different load.

4. Run "node index.js", and the best robot for the load will be printed out.

Future Aspirations.

To extend the features of this solution, I would add it to an API and create
a GET request endpoint to get the closest robot within the requirements.

To implement this, I would just create an endpoint in the backend and then
utilize the same logic as evident in index.js to compute the answer.

Another feature I would like to implement would be to calculate the shortest path
from the closest robot to the load using Djikstra's algorithm.

Another interesting approach to solving this problem would be to use non-callback
code, which is more of a traditional approach.