from fastapi import Depends, HTTPException, status
from app.repository.example_repository import ExampleRepository
from app.schemas.example import ExampleRead, ExampleCreate

class ExampleService:
    def __init__(self, example_repo: ExampleRepository = Depends()):
        self.example_repo = example_repo

    def get_examples(self) -> list[ExampleRead]:
        return self.example_repo.get_all_examples()

    def create_new_example(self, example_create: ExampleCreate) -> ExampleRead:
        # Here you could add more complex business logic,
        # e.g., checking for duplicates, validating data against other sources, etc.
        return self.example_repo.create_example(example_create)

    def delete_example(self, example_id: int) -> ExampleRead:
        deleted_example = self.example_repo.delete_example(example_id)
        if not deleted_example:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Exemplo com ID {example_id} não encontrado.",
            )
        return deleted_example

    def get_example_by_id(self, example_id: int) -> ExampleRead:
        example = self.example_repo.get_example_by_id(example_id)
        if not example:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Exemplo com ID {example_id} não encontrado.",
            )
        return example