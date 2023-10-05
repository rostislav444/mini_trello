import graphene
from pynamodb.attributes import (
    UnicodeAttribute, NumberAttribute, UTCDateTimeAttribute,
    BooleanAttribute, ListAttribute, MapAttribute
)


def pynamo_to_graphene_field(pynamo_field):
    if isinstance(pynamo_field, UnicodeAttribute):
        if pynamo_field.attr_name == 'id':
            return graphene.ID(description=pynamo_field.attr_name, required=True)
        elif pynamo_field.attr_name.split('_')[-1] == 'id':
            return graphene.ID(description=pynamo_field.attr_name)
        return graphene.String(description=pynamo_field.attr_name)
    elif isinstance(pynamo_field, NumberAttribute):
        return graphene.Int(description=pynamo_field.attr_name)
    elif isinstance(pynamo_field, UTCDateTimeAttribute):
        return graphene.DateTime(description=pynamo_field.attr_name)
    elif isinstance(pynamo_field, BooleanAttribute):
        return graphene.Boolean(description=pynamo_field.attr_name)
    elif isinstance(pynamo_field, ListAttribute):
        return graphene.List(graphene.String, description=pynamo_field.attr_name)
    elif isinstance(pynamo_field, MapAttribute):
        return graphene.Field(graphene.JSONString, description=pynamo_field.attr_name)
    else:
        raise ValueError(f"Unsupported PynamoDB field: {pynamo_field}")


class PynamoObjectType(graphene.ObjectType):
    class Meta:
        abstract = True

    @classmethod
    def __init_subclass_with_meta__(cls, model=None, exclude_fields=None, **kwargs):
        if exclude_fields and type(exclude_fields) not in (list, tuple):
            raise ValueError(f"exclude_fields must be a list or tuple, got {type(exclude_fields)}")

        exclude_fields = set(exclude_fields or [])
        exclude_fields.add('password')

        if model:
            for attr_name, attr_obj in model.get_attributes().items():
                if attr_name not in exclude_fields:
                    setattr(cls, attr_name, pynamo_to_graphene_field(attr_obj))
        super(PynamoObjectType, cls).__init_subclass_with_meta__(model=model, **kwargs)
