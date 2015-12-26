## Lucie, connect4 with redux

state container for Connect4 with action creators and helpers.

Can be used with any view layer (angular / angular2 / react / react native / _name_of_latest_framework_ )

### Run tests


```
npm install
npm test
```

### Install

Good question, I `import {all} from '../lucie'`

- `import {reducer} from '../lucie/reducers/games'`
- `import * as actions from '../lucie/actions/games'`
- `import * as helper from '../lucie/helpers/games'`

then use redux's combine reducer (http://rackt.org/redux/docs/api/combineReducers.html) feature to add the reducer to your project

### Todo

- [ ] remove .gameId references and replace with .id
- [ ] don't load all lodash but only {merge}
- [ ] module loader things

