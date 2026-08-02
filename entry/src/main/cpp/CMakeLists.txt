cmake_minimum_required(VERSION 3.16.0)
project(spike_native)

set(NATIVERENDER_ROOT_PATH ${CMAKE_CURRENT_SOURCE_DIR})
include_directories(${NATIVERENDER_ROOT_PATH})

add_library(entry SHARED napi_init.cpp)

target_link_libraries(entry PUBLIC
    libace_napi.z.so
    libhilog_ndk.z.so
    librawfile.z.so
    libohweb.so
)
