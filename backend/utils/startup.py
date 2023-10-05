import uuid

from app.models import models, UsersModel, RoleEnum


def create_tables():
    for model in models:
        print(model, model.exists())
        if not model.exists():
            model.create_table(read_capacity_units=1, write_capacity_units=1, wait=True)


def create_admin_user():
    for i in range(10):
        data = {
            'id': str(uuid.uuid4()),
            'first_name': 'Name{}'.format(str(i)),
            'last_name': 'Lastname{}'.format(str(i)),
            'email': 'email_{}gmail.com'.format(str(i)),
            'role': RoleEnum.USER.value,
        }
        if UsersModel.user_email_index.count(hash_key=data['email']) == 0:
            user = UsersModel(**data)
            user.set_password('password')
            user.save()
            print('User {} already exists'.format(data['email']))

    if UsersModel.user_role_index.count(hash_key=RoleEnum.ADMIN.value) == 0:
        user = UsersModel(
            id=str(uuid.uuid4()),
            email='admin@admin.com',
            first_name='Admin',
            last_name='User',
            role=RoleEnum.ADMIN.value
        )
        user.set_password('admin')
        user.save()
        print('Admin user created')


__all__ = [
    'create_tables',
    'create_admin_user',
]
