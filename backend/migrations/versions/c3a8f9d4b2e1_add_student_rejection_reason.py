"""add student rejection reason

Revision ID: c3a8f9d4b2e1
Revises: bc77f61fc132
Create Date: 2026-03-17 16:40:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c3a8f9d4b2e1'
down_revision = 'bc77f61fc132'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('students', schema=None) as batch_op:
        batch_op.add_column(sa.Column('rejection_reason', sa.Text(), nullable=True))


def downgrade():
    with op.batch_alter_table('students', schema=None) as batch_op:
        batch_op.drop_column('rejection_reason')
