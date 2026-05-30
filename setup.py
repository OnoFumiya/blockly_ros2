import os
from glob import glob
from setuptools import find_packages, setup

package_name = 'blockly_ros2'

setup(
    name=package_name,
    version='0.0.0',
    packages=find_packages(exclude=['test']),
    data_files=[
        ('share/ament_index/resource_index/packages',
            ['resource/' + package_name]),
        ('share/' + package_name, ['package.xml']),
        (os.path.join('share', package_name, 'launch'), glob('launch/*.py')),
        (os.path.join('share', package_name, 'config'), glob('config/*.yaml')),
        (os.path.join('share', package_name, 'img'), glob('img/*')),
        (os.path.join('share', package_name, 'template_files'), glob('template_files/*')),
        (os.path.join('share', package_name, 'blockly_ros2', 'static'), glob('blockly_ros2/static/*')),
    ],
    install_requires=['setuptools'],
    zip_safe=True,
    maintainer='fumiya',
    maintainer_email='fumiyaono.choi@gmail.com',
    description='TODO: Package description',
    license='TODO: License declaration',
    extras_require={
        'test': [
            'pytest',
        ],
    },
    entry_points={
        'console_scripts': [
            'server = blockly_ros2.server:main',
        ],
    },
)
