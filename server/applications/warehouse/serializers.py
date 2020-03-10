from rest_framework import serializers

from applications.accounts.base_serializers import UsernameSerializer
from applications.parlors.serializers import ParlorSerializer
from applications.warehouse.models import (
    Category,
    Item,
    Warehouse,
    Consumable,
)
from shared.serializers import PrimaryKeyField


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = (
            'id',
            'name',
        )


class ItemSerializer(serializers.ModelSerializer):

    category = CategorySerializer()

    class Meta:
        model = Item
        fields = (
            'id',
            'category',
            'name',
            'units',
            'purchase_price',
            'sell_price',
        )


class WarehouseSerializer(serializers.ModelSerializer):

    item = ItemSerializer()
    parlor = ParlorSerializer()

    class Meta:
        model = Warehouse
        fields = (
            'id',
            'parlor',
            'item',
            'value',
        )


class ConsumableSerializer(serializers.ModelSerializer):

    created_by = UsernameSerializer(read_only=True)
    item = PrimaryKeyField(
        model=Item,
        serializer=ItemSerializer,
        queryset=Item.objects.all()
    )

    class Meta:
        model = Consumable
        fields = (
            'id',
            'record',
            'item',
            'value',
            'created_by',
            'created_at',
        )
        read_only_fields = (
            'id', 
            'created_by', 
            'created_at',
        )
    
    def validate(self, attrs):

        if self.context['request'].method == "PATCH":
            if attrs.get('item', None) is not None:
                raise serializers.ValidationError(
                    "Нельзя изменить товар, для этого удалить этот расходник и внесите новый."
                )
            if (record := attrs.get('record', None)) is not None:
                if record.parlor != self.instance.parlor:
                    raise serializers.ValidationError(
                        "Нельзя изменить, т.к. у расходников разные студии."
                    )
            if (new_value := attrs.get('value', None)) is not None:
                old_value = self.instance.value
                warehouse = Warehouse.get_by_parlor(self.instance.record.parlor, self.instance.item)
                if warehouse is None:
                    raise serializers.ValidationError("На складе НЕТ этого товара!")
                elif warehouse.value + old_value - new_value < 0:
                    raise serializers.ValidationError("На складе недостаточно товара!")
        else:
            if attrs.get('record').consumables.filter(item=attrs.get('item')).exists():
                raise serializers.ValidationError({"item": "Этот товар уже добавлен к записи, измените количество в существующем расходнике!"})

            warehouse = Warehouse.get_by_parlor(attrs.get('record').parlor, attrs.get('item'))
            if not warehouse:
                raise serializers.ValidationError({"item": "На складе НЕТ этого товара!"})
            elif warehouse.value - attrs.get('value') < 0:
                raise serializers.ValidationError({"value": f"На складе недостаточно товара! Осталось – {warehouse.value} {warehouse.item.units}"})
        return attrs

    def update(self, instance, validated_data):
        old_value = instance.value
        new_instance = super(ConsumableSerializer, self).update(instance, validated_data)
        if validated_data.get('value', None) is not None:
            return new_instance.update_warehouse(old_value=old_value)
        return new_instance

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return Consumable.create_consumable(**validated_data)
