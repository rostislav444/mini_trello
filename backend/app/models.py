from datetime import datetime

import bcrypt
import graphene
from flask_jwt_extended import create_access_token
from pynamodb.attributes import UnicodeAttribute, UTCDateTimeAttribute, NumberAttribute
from pynamodb.indexes import GlobalSecondaryIndex, AllProjection
from pynamodb.models import Model


class BaseModel(Model):
    class Meta:
        abstract = True
        region = 'us-west-2'
        host = 'http://localhost:8000'


class RoleEnum(graphene.Enum):
    ADMIN = 'ADMIN'
    USER = 'USER'
    GUEST = 'GUEST'


class UserRoleIndex(GlobalSecondaryIndex):
    class Meta:
        read_capacity_units = 2
        write_capacity_units = 1
        projection = AllProjection()

    role = UnicodeAttribute(hash_key=True)


class UserEmailIndex(GlobalSecondaryIndex):
    class Meta:
        read_capacity_units = 2
        write_capacity_units = 1
        projection = AllProjection()

    email = UnicodeAttribute(hash_key=True)


class UsersModel(BaseModel):
    class Meta(BaseModel.Meta):
        table_name = 'users'

    id = UnicodeAttribute(hash_key=True)
    first_name = UnicodeAttribute()
    last_name = UnicodeAttribute()
    email = UnicodeAttribute()
    role = UnicodeAttribute()
    password = UnicodeAttribute()
    user_role_index = UserRoleIndex()
    user_email_index = UserEmailIndex()

    def set_password(self, password):
        self.password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def verify_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password.encode('utf-8'))

    def generate_token(self):
        return create_access_token(identity=self.id)

    def to_dict(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'role': self.role,
            'email': self.email,
        }


class DashboardModel(BaseModel):
    class Meta(BaseModel.Meta):
        table_name = 'dashboards'

    id = UnicodeAttribute(hash_key=True)
    title = UnicodeAttribute()
    description = UnicodeAttribute(null=True)


class DashboardAssigneeIndex(GlobalSecondaryIndex):
    class Meta:
        read_capacity_units = 2
        write_capacity_units = 1
        projection = AllProjection()

    user_id = UnicodeAttribute(hash_key=True)


class DashboardAssigneeModel(BaseModel):
    class Meta(BaseModel.Meta):
        table_name = 'dashboard_assignees'

    id = UnicodeAttribute(hash_key=True)
    dashboard_id = UnicodeAttribute()
    user_id = UnicodeAttribute()
    dashboard_assignee_index = DashboardAssigneeIndex()


class ColumnOrderIndex(GlobalSecondaryIndex):
    class Meta:
        read_capacity_units = 2
        write_capacity_units = 1
        projection = AllProjection()

    order = NumberAttribute(range_key=True)
    dashboard_id = UnicodeAttribute(hash_key=True)


class ColumnsModel(BaseModel):
    class Meta(BaseModel.Meta):
        table_name = 'columns'

    id = UnicodeAttribute(hash_key=True)
    title = UnicodeAttribute()
    description = UnicodeAttribute(null=True)
    order = NumberAttribute()
    dashboard_id = UnicodeAttribute()
    column_order_index = ColumnOrderIndex()


class CardOrderIndex(GlobalSecondaryIndex):
    class Meta:
        read_capacity_units = 2
        write_capacity_units = 1
        projection = AllProjection()

    order = NumberAttribute(range_key=True)
    column_id = UnicodeAttribute(hash_key=True)


class PriorityEnum(graphene.Enum):
    LOW = 'LOW'
    MEDIUM = 'MEDIUM'
    HIGH = 'HIGH'


class CardsModel(BaseModel):
    class Meta(BaseModel.Meta):
        table_name = 'cards'

    id = UnicodeAttribute(hash_key=True)
    title = UnicodeAttribute()
    description = UnicodeAttribute(null=True)
    column_id = UnicodeAttribute()
    priority = UnicodeAttribute(null=True)
    status = UnicodeAttribute(null=True)
    order = NumberAttribute()
    card_order_index = CardOrderIndex()


class CardAssigneeModel(BaseModel):
    class Meta(BaseModel.Meta):
        table_name = 'card_assignees'

    id = UnicodeAttribute(hash_key=True)
    card_id = UnicodeAttribute()
    user_id = UnicodeAttribute()


class CardCommentsIndex(GlobalSecondaryIndex):
    class Meta:
        read_capacity_units = 2
        write_capacity_units = 1
        projection = AllProjection()

    created_at = NumberAttribute(range_key=True)
    card_id = UnicodeAttribute(hash_key=True)


class CardCommentsModel(BaseModel):
    class Meta(BaseModel.Meta):
        table_name = 'card_comments'

    id = UnicodeAttribute(hash_key=True)
    card_id = UnicodeAttribute()
    user_id = UnicodeAttribute()
    comment = UnicodeAttribute()
    created_at = UTCDateTimeAttribute(default=datetime.now)
    updated_at = UTCDateTimeAttribute(default=datetime.now)

    card_comments_index = CardCommentsIndex()


class CardAttachmentsModel(BaseModel):
    class Meta(BaseModel.Meta):
        table_name = 'card_attachments'

    id = UnicodeAttribute(hash_key=True)
    card_id = UnicodeAttribute()
    user_id = UnicodeAttribute()
    attachment = UnicodeAttribute()


models = [
    UsersModel,
    DashboardModel,
    DashboardAssigneeModel,
    ColumnsModel,
    CardsModel,
    CardAssigneeModel,
    CardCommentsModel,
    CardAttachmentsModel,
]

indexes = [
    ColumnOrderIndex,
]

__all__ = [
    'RoleEnum',
    'UsersModel',
    'DashboardModel',
    'ColumnOrderIndex',
    'DashboardAssigneeModel',
    'ColumnsModel',
    'CardsModel',
    'CardAssigneeModel',
    'CardCommentsModel',
    'CardAttachmentsModel',
]
