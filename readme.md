# RDB

Client side tool for manage data in database based at Redux.
Provides a simple structure and lightweight abstraction level.

## How to use
```
DB = new DataBase([...MODELS ARRAY...]);
```

You can connect that DB instance as Redux storage into your application.

You can assign models into database at any moment. To do that use method `registerModel`:

```
import Star from './star';

DB.registerModel(Star);
```

## Model defenition

Each model should be nested from `BaseModel`.

```
class Guests extends BaseModel {
  get fullName() {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  static get properies() {
    return {
      id: null,
      firstName: null,
      lastName: null,
      email: null
    };
  }
}
```

## Model Methods

### load
Load your raw objects as model entries into storage
```
Model.load([...ARRAY OF MODELS...]);
```

### create
Create new model instance and save into storage from object

### all
Get array of all entries from storage

### where
Apply filter to find specific record from storage.
```
const filter = ["all", ["==", "checkinDate", "2018-04-01"], ["==", "nights", 1]];
DB.ModelName.where(filter);
```

### getBy
Get single model entry by specific value at specific field:

```
DB.ModelName.getBy("nights", 1)
```

### getByID
Get specific element by ID
