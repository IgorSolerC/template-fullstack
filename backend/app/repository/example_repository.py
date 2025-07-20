from sqlalchemy.orm import Session
from fastapi import Depends
from app.db.session import get_db
from app.models.example import Example as ExampleModel
from app.schemas.example import ExampleCreate

class ExampleRepository:
    def __init__(self, db: Session = Depends(get_db)):
        self.db = db

    def get_all_examples(self) -> list[ExampleModel]:
        return self.db.query(ExampleModel).all()

    def get_example_by_id(self, example_id: int) -> ExampleModel | None:
        return self.db.query(ExampleModel).filter(ExampleModel.id == example_id).first()

    def create_example(self, example_create: ExampleCreate) -> ExampleModel:
        db_example = ExampleModel(
            name=example_create.name,
            description=example_create.description
        )
        self.db.add(db_example)
        self.db.commit()
        self.db.refresh(db_example) # Atualiza valores default como ID
        return db_example
    
    def delete_example(self, example_id: int) -> ExampleModel | None:
        db_example = self.get_example_by_id(example_id)
        if db_example:
            self.db.delete(db_example)
            self.db.commit()
        return db_example