import re

from graphql_relay import from_global_id


def is_valid_uuid(uuid_string):
    pattern = re.compile(r'^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\Z', re.I)
    return bool(pattern.match(uuid_string))


def decode_id(_id):
    return _id if is_valid_uuid(_id) else from_global_id(_id)[1]


def decode_ids(ids):
    return [decode_id(_id) for _id in ids]
