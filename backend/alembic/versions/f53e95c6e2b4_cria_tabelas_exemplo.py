"""Cria tabelas exemplo

Revision ID: f53e95c6e2b4
Revises: 
Create Date: 2025-07-20 06:32:21.956022
"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f53e95c6e2b4'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('examples',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=50), nullable=True),
    sa.Column('description', sa.String(length=255), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_examples_id'), 'examples', ['id'], unique=False)
    op.create_index(op.f('ix_examples_name'), 'examples', ['name'], unique=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_examples_name'), table_name='examples')
    op.drop_index(op.f('ix_examples_id'), table_name='examples')
    op.drop_table('examples')
    # ### end Alembic commands ###