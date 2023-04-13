from rest_framework import serializers

class ServiceSerializer(serializers.Serializer):
    sid = serializers.IntegerField()
    name = serializers.CharField()
    sector = serializers.CharField()
    #address = serializers.ListField(child= serializers.DictField(child=serializers.CharField()))
    #rating = serializers.ListField(child= serializers.DictField(child=serializers.CharField()))
    #additional_data = serializers.ListField(child= serializers.DictField(child=serializers.CharField()))