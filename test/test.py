
template_value = {"name": None, "type": None}

value_rules1 = {"value_rules": {"data": {"type": "string", "name": "テキスト"}}}
value_rules2 = {"value_rules": {"lenear": {"x": {"type": "float", "name": "X方向"}, "y": {"type": "float", "name": "Y方向"}}, "angular": {"z": {"type": "float", "name": "その場回転"}}}}
value_rules3 = {"value_rules": {"lenear": {"x": {"type": "float", "name": "X方向"}, "y": {"type": "float", "name": "Y方向"}}, "angular": {"z": {"type": "float", "name": "その場回転"}, "coord": {"zz": {"type": "float", "name": "詳細設定"}}}}}

def build_tree(prefix, msg, template_val):
    tree = {}

    for key, value in msg.items():

        # 現在のキー名を生成
        current_key = f"{prefix}.{key}" if prefix else key

        # 最終ノード判定
        if isinstance(value, dict) and (value.keys() == template_val.keys()):
            tree[current_key] = value["type"]

        # まだネストが続く場合
        elif isinstance(value, dict):
            tree.update(build_tree(current_key, value, template_val))

    return tree



tree1 = build_tree("", value_rules1["value_rules"], template_value)
print(tree1)
# {"data": {"type": "string", "name": "テキスト"}}

tree2 = build_tree("", value_rules2["value_rules"], template_value)
print(tree2)
# {"linear.x": {"type": "float", "name": "X方向"}, "linear.y": {"type": "float", "name": "Y方向"}, {"angular.z": {"type": "float", "name": "その場回転"}}}

tree3 = build_tree("", value_rules3["value_rules"], template_value)
print(tree3)
# {"linear.x": {"type": "float", "name": "X方向"}, "linear.y": {"type": "float", "name": "Y方向"}, {"angular.z": {"type": "float", "name": "その場回転"}, {"angular.coord.zz": {"type": "float", "name": "その場回転"}}}