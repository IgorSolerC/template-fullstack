import time
from fastapi import APIRouter, Depends, status
from app.services.example_service import ExampleService
from app.schemas.example import ExampleRead, ExampleCreate

router = APIRouter()

@router.get("/", response_model=list[ExampleRead])
def read_examples(service: ExampleService = Depends()):
    """
    Retrieve all examples.
    """
    time.sleep(2) # Usado para simular uma operação demorada
    return service.get_examples()

@router.post("/", response_model=ExampleRead, status_code=status.HTTP_201_CREATED)
def create_example(example_in: ExampleCreate, service: ExampleService = Depends()):
    """
    Create a new example.
    """
    return service.create_new_example(example_in)

@router.delete("/{example_id}", response_model=ExampleRead)
def delete_example(example_id: int, service: ExampleService = Depends()):
    """
    Delete an example by its ID.
    """
    time.sleep(2) # Usado para simular uma operação demorada
    return service.delete_example(example_id)

@router.get("/{example_id}", response_model=ExampleRead)
def read_example(example_id: int, service: ExampleService = Depends()):
    """
    Retrieve a single example by its ID.
    """
    time.sleep(2) # Usado para simular uma operação demorada
    return service.get_example_by_id(example_id)