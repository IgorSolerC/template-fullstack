from pydantic import BaseModel, ConfigDict

class ExampleBase(BaseModel):
    name: str
    description: str | None = None

class ExampleCreate(ExampleBase):
    pass

class ExampleRead(ExampleBase):
    id: int

    # This allows the model to be created from ORM objects
    # It's good practice to include it now for when we add SQLAlchemy
    model_config = ConfigDict(from_attributes=True)